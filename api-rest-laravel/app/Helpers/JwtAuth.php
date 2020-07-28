<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth{
    public $key;

    public function __construct(){
        $this->key = 'esto_es_una_clave_super_secreta-99887766';
    }

    public function signup($email, $password, $getToken = null){
        // ¿Existe el usuario?
        $user = User::where([
            'email' => $email,
            'password' => $password
        ])->first();

        // Comprobar si son correctas
        $signup = false;

        if(is_object($user)){
            $signup = true;
        }
        // Generar token con datos del usuario
        if($signup){
            $token = array(
                'sub' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'surname' => $user->surname,
                'description' => $user->description,
                'image' => $user->image,
                'iat' =>  time(),
                'exp' => time() + (7 * 24 * 60 * 60)
            );

            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            
            // Devolver los datos decodificados o el token, en función de un parámetro
            if(is_null($getToken)){
                $data = $jwt;
            }
            else{
                $data = $decoded;
            }
        }
        else{
            $data = array(
                'status' => 'error',
                'message' => 'Login incorrecto.'
            );
        }
    
        return $data;
    }
    
    public function checkToken($jwt, $getIdentify = false){
        $auth = false;

        try{
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
        }catch(\UnexpectedValueException $e){
            $auth = false;
        }catch(\DomainException $e){
            $auth = false;
        }

        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }
        else{
            $auth = false;
        }

        if($getIdentify){
            return $decoded;
        }

        return $auth;
    }
}

?>