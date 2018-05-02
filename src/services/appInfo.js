import Promise from 'promise';

export async function getVersion() {
  const promise = new Promise((resolve) => {
    try {
      cordova.getAppVersion.getVersionNumber((data) => {
        const obj = {
          success: true,
          data,
        };
        resolve(obj);
      });
    } catch (error) {
      console.log(error);
    }
  });
  return promise;
}

export async function getPackageName() {
  const promise = new Promise((resolve) => {
    try {
      cordova.getAppVersion.getPackageName((data) => {
        const obj = {
          success: true,
          data,
        };
        resolve(obj);
      });
    } catch (error) {
      console.log(error);
    }
  });
  return promise;
}

