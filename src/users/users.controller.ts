import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';


   
interface User {
  id: number;
  name: string;
  age: number;
}

@Controller('users')
export class UsersController {
  private users: User[] = [];
  private idCounter = 1;

  @Get()
  getAllUsers(): User[] {
    return this.users;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() newUser: Omit<User, 'id'>): User {
    const user: User = { id: this.idCounter++, ...newUser };
    this.users.push(user);
    return user;
  }

  @Get(':id')
  getUserById(@Param('id') id: number): User {
    const user = this.users.find(u => u.id === Number(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: Partial<User>): User {
    const userIndex = this.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = { ...this.users[userIndex], ...updateUserDto };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: number): void {
    const userIndex = this.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }
}

