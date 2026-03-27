import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openTab } from '../redux/tabs';

export function useMovieClick() {
    const dispatch = useDispatch();
    const history = useHistory();
    const provider = useSelector(state => state.provider.activeProvider);

    return (movie) => {
        const url = `/movie/${provider}/${movie.categoryId}/${movie.id}/${movie.repeatId}`;
        dispatch(openTab({
            id: String(movie.repeatId),
            title: movie.title,
            url,
            provider,
            categoryId: movie.categoryId,
            movieId: movie.id,
            repeatId: movie.repeatId,
        }));
        history.push(url);
    };
}
