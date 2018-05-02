import Promise from 'promise';

export default (className, key, options) => {
  console.log(className, key, options);
  const promise = new Promise((resolve, reject) => {
    try {
      cordova.plugins[className][key](options, (data) => {
        const obj = {
          success: true,
          data,
        };
        resolve(obj);
      }, (error) => {
        const obj = {
          success: false,
          data: error,
        };
        resolve(obj);
      });
    } catch (error) {
      console.log(error);
    }
  });

  return promise;
};

