<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    // Relación de 1 a N
    public function posts(){
        return $this->hasMany('App\Post');
    }
}
