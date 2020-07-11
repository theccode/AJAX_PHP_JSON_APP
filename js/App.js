(function () {
	let $table = $('#table');
	let $tbody = $table.find('tbody');

	$('#form').on('submit', function (e) {
		const productName = document.getElementById('productName'); //$('#productName').val();
		const dupCheckForProduct = document.getElementById('productName');
		const quantityInStock = document.getElementById('quantityInStock');
		const pricePerItem = document.getElementById('pricePerItem');

		e.preventDefault();
		$.ajax({
			url: '/public/App.php',
			type: 'POST',
			dataType: 'JSON',
			data: {
				productName: productName.value,
				quantityInStock: quantityInStock.value,
				pricePerItem: pricePerItem.value,
			},
			success: function (data) {
				let $row = '<tr contenteditable>';
				$.each(data, function (i, item) {
					$row +=
						'<td>' +
						item.productName +
						'</td><td>' +
						item.quantityInStock +
						'</td><td>' +
						'$' +
						item.pricePerItem.toFixed(2) +
						'</td><td >' +
						item.dateSubmitted +
						'</td><td>' +
						'$' +
						item.totalValueNumber.toFixed(2) +
						'</td>';

					$row += '</tr>';
				});
				$tbody.html($row);
			},
			error: function (error) {
				alert(error + ': There was a situation!');
			},
		});
	});
})();
