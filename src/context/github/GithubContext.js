import { createContext, useReducer } from 'react';
import GithubReducer from './GithubReducer';

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
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

    console.log(items)

    dispatch({
      type: 'GET_USERS',
      payload: items,
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
        users: state.users,
        loading: state.loading,
        searchUsers,
        handleClear
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
