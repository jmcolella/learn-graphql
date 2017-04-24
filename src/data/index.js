const videoA = {
  id: '1',
  title: 'The Godfather',
  duration: 180,
  watched: true
}

const videoB = {
  id: '2',
  title: 'The Godfather II',
  duration: 200,
  watched: true
}

const videos = [ videoA, videoB ]

function getVideoById ( id ) {
  return new Promise( resolve => {
    const [video] = videos.filter( video => video.id === id );

    resolve( video );
  })
}

function getVideos () {
  return new Promise( resolve => resolve( videos ) );
}

function createVideo ( { title, duration, watched } ) {
  const video = {
    id: Math.random(),
    title,
    duration,
    watched
  };

  videos.push( video );

  return video;
};

exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;
