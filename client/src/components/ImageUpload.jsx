import React from 'react';
import { useNavigate } from 'react-router-dom';

function checkIfImageExists(url, callback) {
	const img = new Image();
	img.src = url;

	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};
		img.onerror = () => {
			callback(false);
		};
	}
}

export default function ImageUpload() {
	const navigate = useNavigate();

	let [imageURL, setImageURL] = React.useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		checkIfImageExists(imageURL, (exists) => {
			if (exists) {
				navigate('/tags', { state: imageURL });
			} else {
				setImageURL('');
				alert('Please enter a valid url');
			}
		});
	};

	const handleChange = (e) => {
		setImageURL(e.target.value);
	};

	return (
		<header className='fixed flex bg-white w-full justify-center p-5 z-20'>
			<form onSubmit={handleSubmit} className='justify-center space-x-5'>
				<input
					className='w-96 border border-black rounded-md contactInput p-1'
					type='url'
					name='image_url'
					placeholder='https://image_url.com'
					value={imageURL}
					onChange={handleChange}
					required
				/>
				<button
					type='submit'
					className='bg-black p-1 px-2 rounded-md font-semibold text-white'>
					Upload
				</button>
			</form>
		</header>
	);
}
