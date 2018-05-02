import Promise from 'promise';

export async function getCurrentSSID() {
  const promise = new Promise((resolve) => {
    try {
      WifiWizard.getCurrentSSID((data) => {
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
}

export async function checkIs5G() {
  const promise = new Promise((resolve) => {
    try {
      WifiWizard.is5g((data) => {
        const obj = {
          success: true,
          data: Boolean(data),
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
}

export async function connectNetwork(SSID) {
  const promise = new Promise((resolve) => {
    try {
      WifiWizard.connectNetwork(SSID, (data) => {
        const obj = {
          success: true,
          data,
        };
        resolve(obj);
        console.log(obj);
      }, (error) => {
        const obj = {
          success: false,
          data: error,
        };
        resolve(obj);
        console.log(obj);
      });
    } catch (error) {
      console.log(error);
    }
  });
  return promise;
}