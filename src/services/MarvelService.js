import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {request, clearError, process, setProcess} = useHttp();
    // _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    // _apiKey = 'apikey=29471d44995d60fbbbb8c64cb7c54085';

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 8;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const _transformCharacter =(char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComic =(comic) => {
    return {
        id: comic.id,
        title: comic.title,
        description: comic.description || 'There is no description',
        pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No information about pages',
        thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
        languages: comic.textObjects[0]?.languages || "en-us",
        price: comic.prices[0].price ? `${comic.prices[0].price}$`
				: "not available",
        }
    }

    return {
            clearError,
            process,
            setProcess,
            getAllCharacters,
            getCharacter,
            getAllComics,
            getComic,
            getCharacterByName
    }
}

export default useMarvelService;