import { useReducer, useEffect } from 'react'
import axios from 'axios'
import { Jobs } from './interfaces/jobs'

export interface Istate {
  jobs: Jobs
  error: boolean
  loading: boolean
  hasNextPage: boolean
}

interface IPayload {
  jobs: Jobs
  error: boolean
  hasNextPage: boolean
}

type ActionsTypes = 'make_request' | 'get_data' | 'error'

const ACTIONS: {
  MAKE_REQUEST: 'make_request'
  GET_DATA: 'get_data'
  ERROR: 'error'
  UPDATE_HAS_NEXT_PAGE: 'update_has_next_page'
} = {
  MAKE_REQUEST: 'make_request',
  GET_DATA: 'get_data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update_has_next_page'
}

type IAction =
  | {
      type: 'make_request'
      payload?: IPayload
    }
  | {
      type: 'get_data' | 'error' | 'update_has_next_page'
      payload: IPayload
    }
type Parameters = {
  /** description — A search term, such as "ruby" or "java". This parameter is aliased to search.  */
  description?: string
  /** location — A city name, zip code, or other location search term.  */
  location?: string
  /** lat — A specific latitude. If used, you must also send long and must not send location. */
  lat?: string
  /** long — A specific longitude. If used, you must also send lat and must not send location. */
  long?: string
  /** full_time — If you want to limit results to full time positions set this parameter to 'true'. */
  full_time?: string
}

const INITIAL_STATE = {
  loading: false,
  error: false,
  jobs: [],
  hasNextPage: true
}
function reducer(state: Istate = INITIAL_STATE, action: IAction): Istate {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { ...state, loading: true }
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs }
    case ACTIONS.ERROR:
      return { ...state, error: action.payload.error, jobs: [] }
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }
    default:
      return state
  }
}

const BASE_URL =
  'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'

export default function useFetchJobs(params: Parameters, page: number) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source()
    dispatch({ type: ACTIONS.MAKE_REQUEST })
    const cancelToken2 = axios.CancelToken.source()

    console.log(`use fetched jobs called`, BASE_URL)
    axios
      .get(BASE_URL, {
        params: {
          cancelToken: cancelToken1.token,
          markdown: true,
          page: page,
          ...params
        }
      })
      .then((res: { data: Jobs }) => {
        dispatch({
          type: ACTIONS.GET_DATA,
          payload: { jobs: res.data, error: false, hasNextPage: true }
        })
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        console.log(err)
        dispatch({
          type: ACTIONS.ERROR as ActionsTypes,
          payload: { error: true, jobs: [], hasNextPage: false }
        })
      })

    axios
      .get(BASE_URL, {
        params: {
          cancelToken: cancelToken2.token,
          markdown: true,
          page: page + 1,
          ...params
        }
      })
      .then((res: { data: Jobs }) => {
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: {
            hasNextPage: res.data.length !== 0,
            error: false,
            jobs: state.jobs
          }
        })
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        console.log(err)
        dispatch({
          type: ACTIONS.ERROR as ActionsTypes,
          payload: { error: true, jobs: [], hasNextPage: false }
        })
      })

    return () => {
      cancelToken1.cancel()
      cancelToken2.cancel()
    }
  }, [page, params])
  return state
}
