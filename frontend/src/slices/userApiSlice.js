import { apiSlice } from "./apiSlice";

/*
Endpoints: These are akin to defining "routes" in a web server. You specify how data is fetched or manipulated.
Query: This defines the equivalent of a "controller action" that handles the request logic.
*/

// prepare the endpoint to give to the apiSlice endpoints: property

// give endpoints to our query object
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // instead of fetching data (query), we're making data (mutating)
        login: builder.mutation({
        // this remains query: either way
            query: (data) => ({
                // so we're sending a POST request containing user input (data) to the endpoint
                url: `/users/login`,
                method: 'POST',
                body: data,
            }), 
        }),
        // targeting the users endpoint only
        register: builder.mutation({
            query: (data) => ({
                url: `/users/register`,
                method: 'POST',
                body: data,
            }),
        })
    })
})

export const { useLoginMutation, useRegisterMutation } = userApiSlice;