<?php
//namespace Product;

class Product implements Routine
{
    private $productId;
    private $productName;
    private $quantityInStock;
    private $pricePerItem;
    private $cmd;
    public $recUpdated;

    public function __construct( $productId,  $productName,  $quantityInStock,  $pricePerItem,   $cmd)
    {
        //read json file from disk
        try {
            $GLOBALS['dataFile']= __DIR__ . '/../Data/product.json';
        } catch(Exception $e){
            echo json_encode('Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line '. $e->getLine());
        }

        $this->productId = $productId;
        $this->productName = $productName;
        $this->quantityInStock = $quantityInStock;
        $this->pricePerItem = $pricePerItem;
        $this->cmd = $cmd;
    }

    //save or update product details.
    public function save(){
        $productId = $this->productId;
        $productName = $this->productName;
        $quantityInStock = $this->quantityInStock;
        $pricePerItem = $this->pricePerItem;
        $totalValueNumber = $this->quantityInStock * $this->pricePerItem;

        if (!empty($productName) && !empty($quantityInStock) && !empty($pricePerItem)){
            $date = new DateTime();

            $productDescription = [
                'id' => $productId,
                'productName'=>$productName,
                'quantityInStock'=>$quantityInStock,
                'pricePerItem'=>floatval($pricePerItem),
                'dateSubmitted' => $date->format('jS F Y'),
                'totalValueNumber' => $totalValueNumber,
            ];

            $data = $this->getJsonDataFile();

            if ($this->cmd === 'edit'){
                //update product details
                foreach ($data as $datum => $entry) {
                    if ($entry['id'] == $productId){
                        $data[$datum]['id'] = $productId;
                        $data[$datum]['productName'] = $productName;
                        $data[$datum]['quantityInStock'] = $quantityInStock;
                        $data[$datum]['pricePerItem'] = floatVal($pricePerItem);
                        $data[$datum]['dateSubmitted'] = $date->format('jS F Y');
                        $data[$datum]['totalValueNumber'] = $totalValueNumber;
                        $data = array(json_encode($data, JSON_PRETTY_PRINT));
                        try {
                            file_put_contents($GLOBALS['dataFile'], $data);
                        } catch(Exception $e){
                            echo json_encode('Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line '. $e->getLine());
                        }
                    }
                }
                echo json_encode('Data updated successfully!');
            } else if  ($this->cmd === 'save'){
                array_push($data, $productDescription);
                $data =  array(json_encode($data, JSON_PRETTY_PRINT));
                try {
                    file_put_contents($GLOBALS['dataFile'], $data);
                } catch(Exception $e){
                    echo json_encode('Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line '. $e->getLine());
                }
                echo json_encode('Data saved successfully!');
            } else {
                echo json_encode('Select an operation to perform: Save, Edit, or Remove');
            }
        }
    }

    //read product details
    public function read(){
        //Initialize json file with empty array if it contains null.
        if (file_get_contents($GLOBALS['dataFile'] ) == null){
            file_put_contents($GLOBALS['dataFile'], '[]');
            echo json_encode(null);
        } else {
            $this->recUpdated = file_get_contents($GLOBALS['dataFile']);
            echo $this->recUpdated;

        }
    }

    //delete product details
    public function remove(){
        $data = $this->getJsonDataFile();
        foreach ($data as $datum => $entry) {
            if ($entry['id'] == $this->productId){
                unset($data[$datum]);

                $data = json_encode($data, JSON_PRETTY_PRINT);
                try {
                    file_put_contents($GLOBALS['dataFile'], $data);
                } catch(Exception $e){
                    echo json_encode('Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line '. $e->getLine());
                }
            }
        }
        echo json_encode('Product successfully removed!');
    }

    //read json data file and decode the content into php array object
    private function getJsonDataFile(){
        try {
            $jsonData = file_get_contents($GLOBALS['dataFile']);
        } catch(Exception $e){
            echo json_encode('Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line '. $e->getLine());
        }
        $data = json_decode($jsonData,true);
        return $data;
    }
}