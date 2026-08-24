import BlogCard from "../components/BlogCard.js"


export default {
    template :`
    

    <div class="p-4">
    <div>
        <h1> image : {{$store.state.image}} </h1>
    </div>
        <div>  
            <h1> Hello  : {{$store.state.user_email}} </h1>
        </div>
    

        <h1> Blogs Feed 👌</h1>
       
        <div v-if="blogs.length === 0" class = "alert alert-info">
            Follow someone to see blogs.
        </div>
        <div v-else>
            <h1>  </h1>   
            <BlogCard v-for="blog in validBlogs" 
            
            :key ="blog.id" 
             v-bind:title="blog.title"  
             :date="blog.timestamp" 
             :author_email="blog['author.email']"
             :blog_id="blog.id" />
        </div>
        
    </div>
    `,
    data(){
        return {
            blogs : []
        }
     
    },
    computed: {
        validBlogs() {
            return this.blogs.filter(blog => blog && blog.id && blog.title);
        }
    },


    methods : {

    },
    async mounted(){
        const res = await fetch(location.origin + '/api/feed', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        });
         if (res.ok){
            this.blogs = await res.json()
            
            }else {
                console.warn('error fetching')
            }
        
    },
    components : {
        BlogCard,
    }
   
}