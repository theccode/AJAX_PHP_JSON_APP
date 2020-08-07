<?php
function autoloader($className){
    $filename = str_replace('\\', '/', $className) . '.php';
    $file = __DIR__.'/../classes/'.$filename;
    include $file;
}
spl_autoload_register('autoloader');