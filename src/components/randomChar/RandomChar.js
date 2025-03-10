import {Component} from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        // name: null,
        // description: null,
        // thumbnail: null,
        // homepage: null,
        // wiki: null
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0; //error

        this.updateChar();
        this.timerId = setInterval(this.updateChar, 50000);
    }

    componentWillUnmount(){
        clearInterval(this.timerId)
    }

    onCharLoaded =(char) => {
        // console.log(char);
        this.setState({
            char,
            loading: false
        })
    }
    onCharLoading =() => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
                
                // res => {
                // this.setState(res)

                // this.setState({
                //     name: res.data.results[0].name,
                //     description: res.data.results[0].description,
                //     thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
                //     homepage: res.data.results[0].urls[0].url,
                //     wiki: res.data.results[0].urls[1].url
                // })
                // })
    }

    render() {
        // const {name, description, thumbnail, homepage, wiki} = this.state;
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {/* если три переменные null ничего не отрендерится */}
                {errorMessage}
                {spinner}
                {content}
                {/* {loading ? <Spinner/> : <View char={char}/>} */}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    const imgStyle = thumbnail.includes('image_not_available.jpg')? {objectFit: "contain"} : null;

    // if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    //     imgStyle = {'objectFit' : 'contain'};
    // }
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style ={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;