import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

interface AuthRequest {
  ip: string;
  user: User;
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    // Tratamento de erro
    if (err || !user) {
      console.log('Erro na autenticação:', _info); // Loga detalhes adicionais
      throw new UnauthorizedException(
        err instanceof Error ? err.message : 'Erro desconhecido',
      );
    }

    // Acessa informações do contexto da requisição
    const request = _context.switchToHttp().getRequest<AuthRequest>();
    console.log('Usuário autenticado:', request.user);
    console.log('IP do usuário:', request.ip);

    // Verifica o status da autenticação (caso seja relevante para customização)
    if (_status === 401) {
      console.log('Tentativa de login não autorizada');
    }

    return user;
  }
}
