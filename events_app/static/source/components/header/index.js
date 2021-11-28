import { h } from 'preact';
import { Link } from 'preact-router/match';
import { useState } from 'preact/hooks'
import style from './style.css';
// import './style.css';

// let r = '5'

const Header = props => {

	const [r] = useState('cls')

	// console.log(style.header);

	return <header class={style.header}>
		<h1>Preact App</h1>
		<nav>
			<Link href="/">Home</Link>
			<Link href="/profile">Me</Link>
			<Link href="/profile/john">John</Link>
		</nav>
	</header>
}

export default Header;
