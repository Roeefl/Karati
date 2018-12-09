import Axios from 'axios';

export default Axios.create(
    {
        baseURL: 'https://api.unsplash.com',
        headers: {
            Authorization: 'Client-ID f4e8833b10323b9152698f3ecd8d63743c0ff8ef6e02e31a6f45b03123b17c10'
        }
    }
)