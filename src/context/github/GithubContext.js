import { createContext, useReducer } from 'react';
import GithubReducer from './GithubReducer';

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  async function searchUsers(text) {
    setLoading();

    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`https://api.github.com/search/users?${params}`);
    const { items } = await response.json();

    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  }


// Get single user
  async function getUser(login) {
    setLoading();

    const response = await fetch(`https://api.github.com/users/${login}`);

    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json();
  

      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  }

  async function getUserRepos(login) {
    setLoading();

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10
    });

    const response = await fetch(`https://api.github.com/users/${login}/repos?${params}`);
    const data = await response.json();


    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  }

  const handleClear = () => {
    dispatch({
      type: 'CLEAR_SEARCH_RESULTS',
    });
  }
  
  const setLoading = () => {
    dispatch({
      type: 'SET_LOADING',
    });
  };


  return (
    <GithubContext.Provider
      value={{
        ...state,
        searchUsers,
        handleClear,
        getUser,
        getUserRepos
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
