<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Cargando clases

use App\Http\Middleware\ApiAuthMiddleware;
// Rutas de PRUEBAS

Route::get('/', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}', function ($nombre = null) {
    $texto = '<h2>Texto desde una ruta</h2>';
    $texto.= 'Nombre: '.$nombre;
    return view('pruebas', array(
        'texto' => $texto        
    ));
});

Route::get('/animales', 'PruebasController@index');
Route::get('/test-orm', 'PruebasController@testOrm');

// Rutas de API
    /*
        * GET: Conseguir datos o recursos
        * POST: Guardar datos o recursos o hacer lógica desde un form
        * PUT: Actualizar datos o recursos
        * DELETE: Eliminar datos o recursos
    */

    // Rutas de pruebas
    // Route::get('/usuario/pruebas', 'UserController@pruebas');
    // Route::get('/categoria/pruebas', 'CategoryController@pruebas');
    // Route::get('/entrada/pruebas', 'PostController@pruebas');

    // Rutas de usuario (Controlador)
    Route::post('/api/register', 'UserController@register');
    Route::post('/api/login', 'UserController@login');
    Route::put('/api/user/update', 'UserController@update');
    Route::post('/api/user/upload','UserController@upload')->middleware(ApiAuthMiddleware::class);
    Route::get('/api/user/avatar/{filename}', 'UserController@getImage');
    Route::get('/api/user/detail/{id}', 'UserController@detail');

    // Rutas de categorias (Controlador)
    Route::resource('/api/category', 'CategoryController'); // Resource crea por defecto ciertas rutas "básicas" para el controlador

    // Rutas de entradas (Controlador)
    Route::resource('/api/post', 'PostController'); // Resource crea por defecto ciertas rutas "básicas" para el controlador
    Route::post('/api/post/upload','PostController@upload');
    Route::get('/api/post/image/{filename}', 'PostController@getImage');
    Route::get('/api/post/category/{id}', 'PostController@getPostsByCategory');
    Route::get('/api/post/user/{id}', 'PostController@getPostsByUser');