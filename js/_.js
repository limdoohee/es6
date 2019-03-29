function _curry(fn){
  return function(a,b) {
    return arguments.length == 2 ? fn(a,b) : function(b) { return fn(a,b); };
  }
}

function _curryr(fn){
  return function(a,b) {
    return arguments.length == 2 ? fn(a,b) : function(b) { return fn(b,a); };
  }
}

var _get = _curryr(function(obj, key){
  return obj == null ? undefined : obj[key];
});

function _filter(list, predi){
  var new_list = [];
  _each(list, function(val){
    if(predi(val)) new_list.push(val);
  });
  return new_list;
}

function _map(list, mapper){
  var new_list = [];
  _each(list, function(val, key){
    new_list.push(mapper(val, key));
  });
  return new_list;
}

function _is_object(obj){
  return typeof obj == 'object' && !!obj;
}

function _keys(obj){
  return _is_object(obj) ? Object.keys(obj) : [];
}

// 3. each 만들기
  // 1. _each로 _map, _filter 중복 제거
  var _length = _get('length');

  function _each(list, iter){
    var keys = _keys(list);
    for(var i = 0, len = keys.length; i < len; i++){
      iter(list[keys[i]], keys[i]);
    }
    return list;
  }

  var slice = Array.prototype.slice;
  function _rest(list, num){
    return slice.call(list, num || 1);
  }

  function _reduce(list, iter, memo){
    if(arguments.length == 2){
      memo = list[0];
      list = _rest(list);
    }
    _each(list, function(val){
      memo = iter(memo, val);
    })
    return memo;
  }

  function _pipe(){
    var fns = arguments;
    return function(arg){
      return _reduce(fns, function(arg, fn){
        return fn(arg);
      }, arg);
    }
  }

  function _go(arg){
    var fns = _rest(arguments);
    return _pipe.apply(null, fns)(arg);
  }

  var _map = _curryr(_map);
  // 밑의 두줄 결과 같음
  // console.log( _map([1,2,3], function(val) { return val * 2; }) );
  // console.log( _map(function(val) { return val * 2; })([1,2,3]));

  var _filter = _curryr(_filter);

  // 3. 컬렉션 중심 프로그래밍.html > 1.수집하기 > 1. values
  function _values(data){
    return _map(data, _identity);
  }

  function _identity(val){
    return val;
  }

  // 3. 컬렉션 중심 프로그래밍.html > 1.수집하기 > 2. pluck
  function _pluck(data, key){
    return _map(data, _get(key));
  }

  // 3. 컬렉션 중심 프로그래밍.html > 1.거르기 > 2. _reject
  function _negate(fn){
    return function(val){
      return !fn(val);
    }
  }

  function _reject(data, predi){
    return _filter(data, _negate(predi));
  }

  // 3. 컬렉션 중심 프로그래밍.html > 3. 찾아내기 > 1. _find
  function _find(list, predi){
    var keys = _keys(list);

    for(var i = 0, len = keys.length; i < len; i++){
      var val = list[keys[i]];
      if(predi(val)) return val;
    }
  }

  // 3. 컬렉션 중심 프로그래밍.html > 3. 찾아내기 > 2. _find_index
  function _find_index(list, predi){
    var keys = _keys(list);
    for(var i = 0, len = keys.length; i < len; i++){
      if(predi(list[keys[i]])) return i;
    }
    return -1;
  }

  // 3. 컬렉션 중심 프로그래밍.html > 3. 찾아내기 > 3. _some
  function _some(data, predi){
    return _find_index(data, predi || _identity) != -1;
  }

  // 3. 컬렉션 중심 프로그래밍.html > 3. 찾아내기 > 4. _every
  function _every(data, predi){
    return _find_index(data, _negate(predi || _identity  )) == -1;
  }

  // 3. 컬렉션 중심 프로그래밍.html > 4. 접기 > 1. min, max, min_by, max_by
  function _min(data){
    return _reduce(data, function(a,b){
      return a < b ? a : b;
    });
  }

  function _max(data){
    return _reduce(data, function(a,b){
      return a > b ? a : b;
    });
  }

  function _min_by(data, iter){
    return _reduce(data, function(a,b){
      return iter(a) < iter(b) ? a : b;
    });
  }

  function _max_by(data, iter){
    return _reduce(data, function(a,b){
      return iter(a) > iter(b) ? a : b;
    });
  }

  // 3. 컬렉션 중심 프로그래밍.html > 4. 접기 > 2. group_by, push
  function _push(obj, key, val){
    (obj[key] = obj[key] || []).push(val);
    return obj;
  }

  // 특정 조건을 기준으로 그룹화됨, 배열이 아닌 객체로 출력됨
  var _group_by = _curryr(function(data, iter){
    return _reduce(data, function(grouped, val){
      return _push(grouped, iter(val), val);
    }, {});
  })


  // 3. 컬렉션 중심 프로그래밍.html > 4. 접기 > 3. count_by, inc
  var _inc = function(count, key){
    count[key] ? count[key]++ : count[key] = 1;
    return count;
  }

  var _count_by = _curryr(function(data, iter){
    return _reduce(data, function(count, val){
      return _inc(count, iter(val));
    }, {});
  })

  var _pairs = _map((val, key) => [key, val]);
