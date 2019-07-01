# tsproject

## Project setup, use yarn
```
yarn [install]
```

### Compiles and hot-reloads for development
```
npm run start / dev
```

### Compiles and minifies for production
```
npm run build / build:test (depends on .env U choose)
```

### Prettier your tests
```
npm run prettier
```

### Generate ur route-config
> files in pages should be named like user[.id].vue, then generated route-config is <br>
 { <br>
 &emsp;&emsp;&emsp;path: "/user[/:id]",<br>
 &emsp;&emsp;&emsp;name: "user",<br>
 &emsp;&emsp;&emsp;component: () => import("@/pages/user[.id].vue"),<br>
 }

```
npm run generate:route / generate:route:watch
```

### i18n
explanatory note in main.ts & shims-tsx.d.ts 
