<?php
    include __DIR__.'/../Loader/autoloader.php';

    //create a product
    $product = new Product($_POST['productId'], $_POST['productName'], $_POST['quantityInStock'], $_POST['pricePerItem'], $_POST['cmd']);
    //check on action to perform.
    $func = $_POST['action'];
    if ($func){
        switch ($func){
            case 'saveProduct': $product->save(); break;
            case 'getProduct': $product->read(); break;
            case 'removeProduct': $product->remove(); break;
            default: echo json_encode('Please Select An Operation To Perform'); break;
        }
    }


