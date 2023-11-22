import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withoutCacheBust } from "hooks/useSanitizedSearchParams";
import customization from "config/customization";
import packageInfo from '../../package.json';

export function ologClientInfoHeader() {
    return {"X-Olog-Client-Info": "Olog Web " + packageInfo.version + " on " + window.navigator.userAgent}
}

export const removeEmptyKeys = (obj, exceptions=[]) => {
    const copy = {...obj};
    for(let key of Object.keys(copy).filter(it => exceptions.indexOf(it) === -1)) {
        const val = copy[key];
        if(Array.isArray(val) && val.length === 0) {
            delete copy[key];
            continue;
        }
        if(typeof val === 'string' || val instanceof String) {
            if(val.trim() === '') {
                delete copy[key]
            }
        }
        if(val === undefined || val === null) {
            delete copy[key]
        }
    }
    return copy;
}

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({
        baseUrl: customization.APP_BASE_URL,    // e.g. http://localhost:8080/Olog
        credentials: "include",                      // send credentials with requests
        headers: {...ologClientInfoHeader()}
    }),
    keepUnusedDataFor: 0, // Don't cache anything
    endpoints: builder => ({
        searchLogs: builder.query({
            query: ({searchParams, searchPageParams}) => {
                return {
                    url: '/logs/search',
                    params: { 
                        // remove cache bust so we don't send it to the server
                        // we must do it *here* rather than where useSearchLogsQuery
                        // is called because we want repeated searches of the same
                        // search to trigger calling the api (e.g. polling)
                        ...withoutCacheBust(searchParams), 
                        ...searchPageParams
                    }
                }
            }
        }),
        getTags: builder.query({
            query: () => ({
                url: '/tags'
            })
        }),
        getLogbooks: builder.query({
            query: () => ({
                url: '/logbooks'
            })
        }),
        getArchivedLogbooks: builder.query({
            query: ({id}) => ({
                url: `logs/archived/${id}`
            })
        }),
        getProperties: builder.query({
            query: () => ({
                url: '/properties'
            })
        }),
        getLogbook: builder.query({
            query: ({id}) => ({
                url: `/logs/${id}`
            })
        }),
        createLog: builder.mutation({
            query: ({log, replyTo}) => {

                const bodyFormData = new FormData();

                // Append all files. Each is added with name "files", and that is actually OK
                if(log.attachments && log.attachments.length > 0) {
                    for (let i = 0; i < log.attachments.length; i++) {
                        bodyFormData.append("files", log.attachments[i].file, log.attachments[i].file.name);
                    }
                }
                // Log entry must be added as JSON blob, otherwise the content type cannot be set.
                bodyFormData.append("logEntry", new Blob([JSON.stringify(log)], {type: 'application/json'}));

                return {
                    url: `/logs/multipart?markup=commonmark${replyTo ? `&inReplyTo=${replyTo}` : ""}`,
                    method: 'PUT',
                    body: bodyFormData,
                    formData: true
                }

            }
        }),
        editLog: builder.mutation({
            query: ({log}) => ({
                url: `/logs/${log.id}?markup=commonmark`,
                method: 'POST',
                body: log
            })
        }),
        getUser: builder.query({
            query: () => ({
                url: "/user"
            })
        }),
        login: builder.mutation({
            query: ({username, password}) => {
                const bodyFormData = new FormData();
                bodyFormData.append("username", username);
                bodyFormData.append("password", password);

                return {
                    url: "/login",
                    method: 'POST',
                    body: bodyFormData,
                    formData: true
                }
            }
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "GET" // yes this is a GET...
            })
        })
    })
});

export const { 
    useSearchLogsQuery,
    useGetTagsQuery,
    useGetLogbooksQuery,
    useGetArchivedLogbooksQuery,
    useGetPropertiesQuery,
    useGetLogbookQuery,
    useCreateLogMutation,
    useEditLogMutation,
    useGetUserQuery,
    useLoginMutation,
    useLogoutMutation
} = ologApi;