import { h } from 'preact'
import { FunctionalComponent } from 'preact';

interface IndexProps {}

const App: FunctionalComponent<IndexProps> = () => {
  return (
    <div>
      <main>
        <h1>Welcome to preact development!</h1>
        <p>
          	Inspired by <a href="https://github.com/peterDijk/preact-typescript-rollup-starter">peterDijk template</a>			 
        </p>
		  <p>
		  		Ready to build something amazing? Read <a href="https://preactjs.com/guide/v10/typescript/#typescript-configuration">the docs to get started</a>
		  </p>
		  <h4>See elso:</h4>
		  <ul>
			  <li><a href="https://github.com/Kulak/preactRouterRollupExample/tree/master/src">js-ts boilerplate</a></li>
			  <li><a href="https://github.com/raiyni/preact-rollup-typescript-babel/blob/master/.babelrc">babel-ts boilerplate</a></li>
		  </ul>
      </main>
    </div>
  );
};

export default App;
