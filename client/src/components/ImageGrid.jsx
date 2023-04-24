import { useEffect, useState } from 'react';
import { Gallery } from 'react-grid-gallery';
import '../styles/global.css';

function ImageGrid(props) {
	const [images, setImages] = useState([]);

	useEffect(() => {
		const tagList = props.selectedTags.map((tag) => tag.tag);

		let jsonData = {
			tags: tagList,
		};

		fetch('http://localhost:5000/queryimages', {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData),
		})
			.then((response) => response.json())
			.then((data) => {
				let imgs = [];
				data.forEach((img) => {
					const tags = img.tags.map((tag) => ({ value: tag, title: tag }));
					imgs.push({
						src: img.url,
						tags: tags,
					});
				});
				setImages(imgs);
			})
			.catch((error) => console.log('error', error));
	}, [props.selectedTags]);

	const handleClick = (_, image) => {
		window.open(image.src, '_blank');
	};

	return (
		<div className='h-screen overflow-y-scroll px-1 justify-center'>
			<Gallery
				images={images}
				enableImageSelection={false}
				rowHeight={400}
				onClick={handleClick}
				tagStyle={{
					display: 'inline',
					padding: '.2em .6em .3em',
					fontSize: '75%',
					fontWeight: '500',
					fontFamily: 'Poppins',
					lineHeight: '1',
					color: 'white',
					background: 'rgba(0,0,0,1)',
					textAlign: 'center',
					whiteSpace: 'nowrap',
					verticalAlign: 'baseline',
					borderRadius: '.25em',
				}}
			/>
		</div>
	);
}

export default ImageGrid;
