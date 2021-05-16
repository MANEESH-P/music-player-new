import { useReducer, useEffect } from 'react';
const jsmediatags = require('jsmediatags');

const constants = {
  GET_SONG_DETAILS_SUCCESS: 'GET_SONG_DETAILS',
  GET_SONG_DETAILS_FAILURE: 'GET_SONG_DETAILS_FAILURE'
}

const reducer = (state, action) => {
  switch (action.type) {
    case constants.GET_SONG_DETAILS_SUCCESS:
      return { ...state, songDetails: action.payload.songDetails }
    case constants.GET_SONG_DETAILS_FAILURE:
      return { ...state, error: action.payload.error }
  }
}

const useGetSongDetails = (song) => {
  const [state, dispatch] = useReducer(reducer, { songDetails: {} })
  let tags = {};
  const getThumbnailUrl = (tags) => {
    const picture = tags.tags.picture;
    // create reference to track art
    let base64String = '';
    if (picture) {
      for (let i = 0; i < picture.data.length; i++) {
        base64String += String.fromCharCode(picture.data[i]);
      }
      let imageUri =
        'data:' + picture.format + ';base64,' + window.btoa(base64String);
      return imageUri;
    }
    return '';
  };

  const getInfo = () => {
    jsmediatags.read(song, {
      onSuccess: function (tag) {
        tags = tag;
        let artist = tags.tags.artist;
        let url = getThumbnailUrl(tags);
        let songDetails = { artist, url };
        dispatch({ type: constants.GET_SONG_DETAILS_SUCCESS, payload: { songDetails } })
      },
      onError: function (error) {
        console.log(error);
        dispatch({ type: constants.GET_SONG_DETAILS_FAILURE, payload: { error } })
      },
    });
  }
  useEffect(() => {
    song && getInfo();
  }, [song])

  return state
};



export default useGetSongDetails;