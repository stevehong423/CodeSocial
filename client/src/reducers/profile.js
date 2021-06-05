import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from "../actions/types";

const initialState = {
    profile: null, //request to all profile data
    profiles: [],  //profile listing page (list of developers)
    repost: [], //githup repos
    loading: true,
    error: {} //any errors in the request
}

export default function profileFunc (state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case GET_PROFILES:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state, 
                error: payload,
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            };
        default: 
            return state;
    }
};