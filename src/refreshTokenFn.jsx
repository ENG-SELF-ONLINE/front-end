import axios from 'axios';

const refreshTokenFn = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
            'http://localhost:8888/refresh-token',
            refreshToken,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
            }
        );

        if (response.status === 200) {
            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;
            const expiresIn = response.data.expires_in;

            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken)

            return {accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: expiresIn
            };
        } else {
            console.error('Failed to refresh token:', response);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/';
            return null;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return null;
    }
};

export default refreshTokenFn;