/* import ky from 'ky-universal'

import { API_URL } from '@/constants'
import { getAccessToken, removeFromStorage } from '@/services/auth/auth.helper'
import { AuthService } from '@/services/auth/auth.service'
import { errorCatch, getContentType } from './api.helper'

export const kyClassic = ky.extend({
	prefixUrl: API_URL,
	headers: getContentType(),
	credentials
})

export const kyWithAuth = kyClassic.extend({
	hooks: {
		beforeRequest: [
			request => {
				const accessToken = getAccessToken()
				if (accessToken) {
					request.headers.set('Authorization', `Bearer ${accessToken}`)
				}
			},
		],
		afterResponse: [
			async (request, options, response) => {
				if (!response.ok && response.status === 401) {
					const originalRequest = request
					try {
						await AuthService.getNewTokens()
						return ky(originalRequest)
					} catch (error) {
						if (errorCatch(error) === 'jwt expired') removeFromStorage()
						throw error
					}
				}
				return response
			},
		],
	},
})
 */
