//test that the logger is working
import logger from '../src/logger';

test('Logger should log "Logger is working"', () => {
  const logSpy = jest.spyOn(logger, 'info'); //spy on the logger method
  logger.info('Logger is working');
  expect(logSpy).toHaveBeenCalledWith('Logger is working');
  logSpy.mockRestore(); //restore original method after test
});


  

//Test input validation:
//-Non-valid file path
//-multi-arguments (not 100% sure how they want us to handle this)
//-file path is wrong type (not .txt)
//-txt file contains things other than github or npm urls

//GITHUB
//test github api metrics


//test github non-api metric (LICENSE)
//-test has a MIT license
//-has another license
//-has no license
//-license in main file path
//-one in sub folder
//-first line of readme file

//NPM
//test npm api metrics


//test npm non-api metric (LICENSE)
//-test has a MIT license
//-has another license
//-has no license
//-license in main file path
//-one in sub folder
//-first line of readme file