import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Get() //get user
    findAll() {
        return []
    }
    @Get(':id') //get single user
    findOne(@Param('id') id: string) {
        return { id }
    }

    @Post() //create a users
    create(@Body() user: {}) {
        return user
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() userUpdate: {}) {
        return { id, ...userUpdate }
    }

    @Delete(':id') //delete single user
    deleteOne(@Param('id') id: string) {
        return { id }
    }
}
