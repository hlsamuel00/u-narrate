const moment = require('moment')

module.exports = {
    formatDate: function(date, format){
        return moment(date).format(format)
    },
    postedDate: function(date){
        return moment(date).fromNow()
    },
    truncate: function(string, length){
        if(string.length > length && string.length > 0){
            let new_str = string + ' '
            new_str = string.substring(0,length)
            new_str = string.substring(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : string.substring(0, length)
            return new_str + '...'
        }
        return string
    },
    stripTags: function(input){
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function(storyUser, loggedUser, storyId, floating = true){
        if(storyUser._id.toString() == loggedUser._id.toString()){
            if(floating){
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else{
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    },
    select: function(selected,options){
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            )
    }
}