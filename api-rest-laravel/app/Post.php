<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'title', 'content', 'category_id', 'image', 'user_id', 'updated_at'
    ];

    // Relación de N a 1
    public function user(){
        return $this->belongsTo('App\User', 'user_id');
    }

    public function category(){
        return $this->belongsTo('App\Category', 'category_id');
    }
}
