export default {
    template : `
    <div>
        <h1> this is admin dashboard  </h1>
        <button @click="create_csv"> Get Blog Data </button>
    </div>
    
    `
    ,
    methods : {
         async create_csv(){
            // after clicking create_csv button it will go to create-csv then
           const res  = await fetch(location.origin + '/create-csv',)
            // it will get the task id from the backend(routes.py) then    
           const task_id = (await res.json()).task_id
            //  it will start the setInterval that will keep on fixed interval pulling the get-CSV with the task id and then
           const interval = setInterval(async() => {
               const res = await fetch(`${location.origin}/get-csv/${task_id}`)
            //  when the task is ready(means res.ok) it will console.log and it will open the particular url in a new window and then download happened
               if (res.ok){
                console.log('data is ready')
                window.open(`${location.origin}/get-csv/${task_id}`)
                clearInterval(interval)
               }
           }, 100)
        },
    },
}