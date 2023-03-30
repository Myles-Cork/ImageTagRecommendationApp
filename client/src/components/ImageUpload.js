import React from 'react'

export default function ImageUpload() {
    let [imageURL, setImageURL] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        document.getElementById('image').innerHTML = 
            '<img src="'+ imageURL +'" alt="Uploaded Image" class="object-contain h-[500px] w-[500px]"/>'
    };

    const handleChange = (e) => {
        setImageURL(e.target.value);
    };

    return (
    <div>
        <h1 class='relative flex p-10 justify-center font-bold font-poppins text-5xl'>
            Upload an Image
        </h1>
        
        <form onSubmit={handleSubmit} class='flex justify-center space-x-5'>
            <input class='w-96 border border-black rounded-md contactInput p-1'
                    type='text'
                    name='image_url'
                    placeholder='https://image_url.com'
                    value={imageURL}
                    onChange={handleChange}
                    pattern="https://.*"
                    required/>
            <button type='submit' class='bg-black p-1 px-2 rounded-md font-semibold text-white'>Upload</button>
        </form>

        <div id='image' class='p-10 flex justify-center w-full'></div>
    </div>
    )
}