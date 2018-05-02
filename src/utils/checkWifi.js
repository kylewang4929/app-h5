/**
 * 判断当前网络情况
 */
export default () => {
  try {
    const networkState = navigator.connection.type;
    const states = {};
    states[Connection.UNKNOWN] = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI] = 'WiFi';
    states[Connection.CELL_2G] = '2G';
    states[Connection.CELL_3G] = '3G';
    states[Connection.CELL_4G] = '4G';
    states[Connection.CELL] = 'CellGenericConnection';
    states[Connection.NONE] = 'NoNetwork';
    return states[networkState];
  } catch (error) {
    console.log(error);
  }
};
