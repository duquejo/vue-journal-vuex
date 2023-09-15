import uploadImage from '@/modules/daybook/helpers/uploadImage';
import axios from 'axios';

jest.mock('axios');

describe('uploadImage tests', () => {

  const file = new File([''], 'photo.jpg');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load a file and return its URL', async () => {
  
    axios.post.mockImplementation(() => 
      Promise.resolve({
        data: {
          secure_url: 'https://secure.abc.xyz',
        },
      })
    );
  
    const url = await uploadImage(file);

    expect(typeof url).toBe('string');
  });

  it('should return any error detected', async () => {

    const logErrorSpy = jest.spyOn(console, 'error');

    axios.post.mockImplementation(() => Promise.reject(new Error('Something happened!')));

    const url = await uploadImage(file);

    expect(url).toBeNull();
    expect(logErrorSpy).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledTimes(1);
    expect(logErrorSpy).toHaveBeenCalledWith('Error: ', new Error('Something happened!'));
  });
});