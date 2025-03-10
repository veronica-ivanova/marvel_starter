import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';



class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateAllChars();
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateAllChars = () => {
        // this.foo.bar = 0;

        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);

            // .then(res => 
            //     {console.log(res);
            //     this.setState({charList: res});
            // })
    }
    
    renderItems(arr) {
        const items = arr.map((item) =>  {    
            let imgStyle = {'objectFit' : 'cover'};            
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return ( 
                <li 
                className="char__item"
                key={item.id} 
                onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">${item.name}</div>
                </li>
            )
        })
        // эта конструкция для центровки спинера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        console.log(this.state)

        const {charList, loading, error} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        // console.log(charList)
        // console.log(charList[0]);

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}           
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;