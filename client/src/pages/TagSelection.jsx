import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

function Checkbox(props) {
	return (
		<div className='space-x-5 flex flex-row'>
			<input
				id={props.tag + 'box'}
				value={props.tag}
				type='checkbox'
				className={props.className}
			/>
			<label className='font-poppins text-lg' htmlFor={props.tag}>
				{props.tag}
			</label>
		</div>
	);
}

export default function TagSelection() {
	const location = useLocation();
	const navigate = useNavigate();

	const [suggestedTags, setSuggestedTags] = useState([]);
	const [loading, setLoading] = useState(false);

	// Make predictions on image to get tags
	useEffect(() => {
		setLoading(true);

		let jsonData = {
			url: location.state,
		};

		console.time('predictiontimer');
		fetch('http://localhost:5000/predicttags', {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.timeEnd('predictiontimer');
				setLoading(false);
				if (data.length !== 0) {
					setSuggestedTags(data);
				}
			})
			.catch((error) => console.log('error', error));
	}, [location.state]);

	const handleSubmit = (e) => {
		e.preventDefault();

		// Get tags
		let tagChecks = document.querySelectorAll('.tagCheckbox:checked');
		let tags = [];
		if (tagChecks.length !== 0) {
			tagChecks.forEach((tagCheck) => {
				tags.push(tagCheck.value);
			});
		}

		// Call api and give image url+tags
		let jsonData = {
			url: location.state,
			tags: tags,
		};

		fetch('http://localhost:5000/addimage', {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData),
		}).catch((error) => console.log('error', error));

		navigate('/');
	};

	const checkboxComponents = suggestedTags.map((tag, id) => (
		<Checkbox className='tagCheckbox' key={id} tag={tag} />
	));

	return (
		<div>
			<h1 className='relative flex p-10 justify-center font-bold font-poppins text-5xl'>
				Confirm Tags
			</h1>

			<div
				id='image'
				className='flex flex-col justify-center w-full items-center'>
				<img
					src={location.state}
					alt='Uploaded'
					className='object-contain h-[300px]'
				/>
				{loading && <BeatLoader color='black' className='pt-5' />}
				<form onSubmit={handleSubmit} className='py-5 space-y-5'>
					<div className='flex justify-center'>
						<div className='flex flex-col items-start space-y-5'>
							{checkboxComponents.length === 0 && !loading ? (
								<div>No suitable tags were found</div>
							) : (
								checkboxComponents
							)}
						</div>
					</div>
					{!loading && (
						<div className='flex justify-center'>
							<button
								type='submit'
								className='bg-black p-1 py-2 w-20 rounded-md font-semibold text-white'>
								Submit
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
