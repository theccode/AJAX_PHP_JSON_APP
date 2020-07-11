<?php
$productName = $_POST['productName'];
$quantityInStock = $_POST['quantityInStock'];
$pricePerItem = $_POST['pricePerItem'];
$totalValueNumber = $quantityInStock * $pricePerItem;
$recUpdated = null;

if (!empty($productName) && !empty($quantityInStock) && !empty($pricePerItem)){

     $data = [];
     $date = new DateTime();
     $productDescription = [
          'productName'=>$productName, 
          'quantityInStock'=>$quantityInStock, 
          'pricePerItem'=>floatval($pricePerItem),
          'dateSubmitted' => $date->format('jS F Y'),
          'totalValueNumber' => $totalValueNumber
     ];

     $dataFile = __DIR__ . '/../Data/product.json';
     $jsonData = file_get_contents($dataFile);
     $data = json_decode($jsonData);
     array_push($data, $productDescription);
     $data = array( json_encode($data, JSON_PRETTY_PRINT));
     file_put_contents($dataFile, $data);

     $recUpdated = file_get_contents($dataFile);
} 
if ($jsonData != null){
     echo $recUpdated;
}
