<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    public function __construct(){
        $this->middleware('api.auth', ['except' => [
            'index', 
            'show', 
            'getImage',
            'getPostsByCategory',
            'getPostsByUser',
        ]]);
    }

    public function index(){
        $posts = Post::all()->load('category')->load('user');
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'posts' => $posts
        ], 200);
    }

    public function show($id){
        $post = Post::find($id);
        $post = $post->load('category')->load('user');

        if(is_object($post)){
            $data = array(
                'code' => 200,
                'status' => 'success',
                'posts' => $post
            );
        }
        else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'posts' => 'La entrada no existe.'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function store(Request $request){
        // Recoger datos por POST
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            // Conseguir usuario identificado
            $user = $this->getIdentity($request);

            // Validar datos
            $validate = \Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required',
                'image' => 'required'
            ]);
            
            if($validate->fails()){
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se han guardado el post, faltan datos.'
                );
            }
            else{
                // Guardar post
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params->category_id;
                $post->title = $params->title;
                $post->content = $params->content;
                $post->image = $params->image;
                $post->save();

                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'posts' => $post
                );
            }
            
        }
        else{
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'No se han enviados los datos correctamente.'
            );
        }
        
        // Devolver resultado
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request){
        // Recoger datos por POST
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        // Error por defecto
        $data = array(
            'code' => 400,
            'status' => 'error'
        );

        if(empty($params_array)){
            $data['message'] = 'No se ha actualizado el post, faltan datos.';
        }
        else{
            // Validar datos
            $validate = \Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required'
            ]);
            
            if($validate->fails()){
                $data['message'] = 'No se ha actualizado el post, no ha pasado la validación.';
            }
            else{
                // Eliminar datos que no queremos actualizar
                unset($params_array['id']);
                unset($params_array['user_id']);
                unset($params_array['user']);
                unset($params_array['created_at']);

                // Conseguir usuario identificado
                $user = $this->getIdentity($request);
                
                // Buscar registro a actualizar
                $post = Post::where('id', $id)
                            ->where('user_id', $user->sub)
                            ->first();
                
                if(!empty($post) && is_object($post)){
                    // Actualizar registro
                    $where = array(
                        'id' => $id,
                        'user_id' => $user->sub
                    );
                
                    $post_update = Post::updateOrCreate($where, $params_array);

                    $data = array(
                        'code' => 200,
                        'status' => 'success',
                        'post' => $post,
                        'changes' => $post_update
                    );
                }
                else{
                    $data['message'] = 'No se ha actualizado el post, no ha pasado la identificación.';
                }                
            }
        }
         
        // Devolver resultado
        return response()->json($data, $data['code']);
    }

    public function destroy($id, Request $request){
        // Conseguir usuario identificado
        $user = $this->getIdentity($request);

        // Recoger datos por POST
        $post = Post::where('id', $id)
                    ->where('user_id', $user->sub)
                    ->first();

        if(!empty($post)){
            // Borrar el registro
            $post->delete();

            $data = array(
                'code' => 200,
                'status' => 'success',
                'post' => $post
            );
        }
        else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'El registro que intenta eliminar no existe.'
            );
        }
        
        // Devolver resultado
        return response()->json($data, $data['code']);
    }

    private function getIdentity(Request $request){
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);

        return $user;
    }

    public function upload(Request $request){
        // Recoger imagen de la petición
        $image = $request->file('file0');
        
        // Validar imagen 
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        // Guardar imagen
        if(!$image || $validate->fails()){
            $data = array(
                'code' => 400,
                'error' => 'error',
                'message' => 'Error al subir la imagen'
            );
        }
        else{
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('images')->put($image_name, \File::get($image));
            
            $data = array(
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            );
        }

        // Devolver resultado
        return response()->json($data, $data['code']);
    }

    public function getImage($filename){
        // Comprobar si existe imagen
        $isset = \Storage::disk('images')->exists($filename);

        if($isset){
            // Conseguir imagen
            $file = \Storage::disk('images')->get($filename);
            return new Response($file, 200);
        }
        else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe.'
            );
        }

        // Devolver resultado
        return response()->json($data, $data['code']);
    }

    public function getPostsByCategory($id){
        $posts = Post::where('category_id', $id)->get()->load('category')->load('user');
        
        // Devolver resultado
        return response()->json(array(
            'status' => 'success',
            'posts' => $posts
        ), 200);
    }

    public function getPostsByUser($id){
        $posts = Post::where('user_id', $id)->get()->load('category')->load('user');
        
        // Devolver resultado
        return response()->json(array(
            'status' => 'success',
            'posts' => $posts
        ), 200);
    }
}
