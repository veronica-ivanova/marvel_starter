import { Component } from "react";

import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./charList.scss";

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 1548,
		charEnded: false,
	};
	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest(); //ничего не передается, будет подставлен отступ по умолчанию _baseOffset
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
		});
	};

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({ offset, charList }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}));
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true,
		});
	};

	// updateAllChars = () => {
	//     // this.foo.bar = 0;

	//     this.marvelService
	//         .getAllCharacters()
	//         .then(this.onCharListLoaded)
	//         .catch(this.onError);

	//         // .then(res =>
	//         //     {console.log(res);
	//         //     this.setState({charList: res});
	//         // })
	// }

	renderItems(arr) {
		const items = arr.map((item) => {
			let imgStyle = { objectFit: "cover" };
			if (
				item.thumbnail ===
				"http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
			) {
				imgStyle = { objectFit: "unset" };
			}
			return (
				<li
					className="char__item"
					key={item.id}
					onClick={() => this.props.onCharSelected(item.id)}
				>
					<img
						src={item.thumbnail}
						alt={item.name}
						style={imgStyle}
					/>
					<div className="char__name">${item.name}</div>
				</li>
			);
		});
		// эта конструкция для центровки спинера/ошибки
		return <ul className="char__grid">{items}</ul>;
	}

	render() {
		console.log(this.state);

		const { charList, loading, error, offset, newItemLoading, charEnded } =
			this.state;
		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;
		// console.log(charList)
		// console.log(charList[0]);

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{ display: charEnded ? "none" : "block" }}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

export default CharList;
