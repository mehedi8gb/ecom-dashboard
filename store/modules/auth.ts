import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router' // Import useRouter

interface User {
    id: number
    name: string
    email: string
    phone: string | null
    profile_photo_url: string
    addresses: Address[] // Assuming address is an array, as per your data
    profile: {
        preferredUsername: string
        thumbnailUrl: string
        profileUrl: string
        displayName: string
        aboutMe: string | null
        currentLocation: string | null
        emails: string | null
        accounts: any // You can refine this type if you know more details about the 'accounts' structure
        photos: {
            value: string
            type: string
        }[]
    },
    created_at: string
}




export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        sessionId: Cookies.get('sessionId') || null,
        loading: false,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
        user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    }),

    getters: {
        getSessionId: (state) => state.sessionId,
        isAuthenticated: (state) => !!state.token,
        authUser: (state) => state.user,
        isLoading: (state) => state.loading,
    },

    actions: {
        initializeAuth() {
            if (typeof window !== 'undefined') {
                this.token = localStorage.getItem('token') || null
                this.user = JSON.parse(localStorage.getItem('user') || 'null')
                this.createSessionId().then(r => r)
                this.loading = false
                console.log('session id', this.sessionId)
            }
        },

        // Generate a session ID and save it in cookies
        async createSessionId() {
            const existingSessionId = Cookies.get('sessionId')
            if (!existingSessionId) {
                const generatedSessionId = 'sess-' + uuidv4()
                this.sessionId = generatedSessionId
                Cookies.set('sessionId', generatedSessionId, { expires: 1 / 24 }) // Expires in 1 hour
            } else {
                this.sessionId = existingSessionId
            }
        },

        // Handle login
        async login({ email, password }: { email: string; password: string }) {
            this.loading = true
            const router = useRouter() // Initialize router here
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/dashboard`, { email, password })
                this.token = response.data.access_token
                this.user = response.data.user

                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))
                console.log('Login successful!')
                router.push('/dashboard') // Navigate to the dashboard
            } catch (error) {
                console.error('Login failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Handle registration
      
        // Handle logout
       

        // Handle password reset request
     

    
    },
})
