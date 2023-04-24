import Multiselect from 'multiselect-react-dropdown';

function TagFilter(props) {
	const handleSelect = (selectedList, selectedItem) => {
		props.setSelectedTags(selectedList);
	};

	const handleRemove = (selectedList, selectedItem) => {
		props.setSelectedTags(selectedList);
	};

	return (
		<div className='flex flex-row border-solid items-center gap-5'>
			<label htmlFor='tags' className='font-poppins font-bold'>
				Filter by Tag:
			</label>
			<Multiselect
				id='tags'
				hideSelectedList
				showCheckbox
				options={props.allTags}
				selectedValues={props.selectedTags}
				onSelect={handleSelect}
				onRemove={handleRemove}
				displayValue='tag'
				style={{
					searchBox: {
						border: '1px solid black',
						borderRadius: '10px',
					},
					option: {
						color: 'black',
					},
				}}
			/>
		</div>
	);
}

export default TagFilter;
