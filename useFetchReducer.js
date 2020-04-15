import React, { useEffect, useReducer } from 'react';

const LOADING = 'LOADING';
const RESPONSE_COMPLETE = 'RESPONSE_COMPLETE';
const ERROR = 'ERROR';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        result: null,
        loading: true,
        error: null,
      };
    case RESPONSE_COMPLETE:
      return {
        result: action.payload.response,
        loading: false,
        error: null,
      };
    case ERROR:
      return {
        result: null,
        loading: false,
        error: action.payload.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
};

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({ type: LOADING });

    (async function () {
      try {
        const response = await fetch(url);
        const data = await response.json();
        dispatch({ type: RESPONSE_COMPLETE, payload: { response: data } });
      } catch (error) {
        dispatch({ type: ERROR, payload: { error } });
      }
    })();
  }, []);

  return [state.result, state.loading, state.error];
};
