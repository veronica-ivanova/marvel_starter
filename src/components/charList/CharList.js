import { useState, useEffect, useRef, createRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./charList.scss";

const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [charEnded, setCharEnded] = useState(false);


	const {loading, error, getAllCharacters} = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	}, []) //-пустой массив, ф-ия выполнится 1 раз при создании компонента.

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
	};

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setNewItemLoading(newItemLoading => false);
		setOffset(offset => offset + 9);
		setCharEnded(charEnded => ended);
	};

	const focusOnItem = (ref) => {
		ref.current.classList.add('char__item_selected');
		ref.current.focus();
	}

	const blurOnItem = (ref) => {
		ref.current.classList.remove('char__item_selected');
	}

	const renderItems = arr => {
		const items = arr.map((item, i) => {
			let imgStyle = { "objectFit" : "cover" };
			if (
				item.thumbnail ===
				"http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
			) {
				imgStyle = { "objectFit" : "unset" };
			}
			const itemRef = createRef(null);

			return (
				<CSSTransition
					key={item.id}
					in={true}
					timeout={500}
					classNames="char__item"
					nodeRef={itemRef}
				>
					<li
						className="char__item"
						key={item.id}
						tabIndex={0}
						ref={itemRef}
						onClick={() => {
							props.onCharSelected(item.id);
							focusOnItem(itemRef);

						}}
						onBlur={() => blurOnItem(itemRef)}
						onKeyDown={(e) => {
							if (e.key === ' ' || e.key === "Enter") {
								props.onCharSelected(item.id);
								focusOnItem(i);
							}
						}}>
						<img
							src={item.thumbnail}
							alt={item.name}
							style={imgStyle}
						/>
						<div className="char__name">{item.name}</div>
					</li>
				</CSSTransition>
			);
		});
		// эта конструкция для центровки спинера/ошибки
		return (
			<ul className="char__grid">
				<TransitionGroup component={null}>
					{items}
				</TransitionGroup>
			</ul>
		)
	}

	const items = renderItems(charList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				className="button button__main button__long"
				disabled={newItemLoading}
				style={{ display: charEnded ? "none" : "block" }}
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
	
}

export default CharList;
