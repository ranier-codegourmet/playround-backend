function readPackage(pkg, context) {
  if (pkg.dependencies["@nestjs/common"]) {
    pkg.dependencies["@nestjs/common"] = "^10.3.3";
  }

  if (pkg.dependencies["@nestjs/config"]) {
    pkg.dependencies["@nestjs/config"] = "^3.2.0";
  }

  if (pkg.dependencies["@nestjs/core"]) {
    pkg.dependencies["@nestjs/core"] = "^10.3.3";
  }

  if (pkg.dependencies["@nestjs/mongoose"]) {
    pkg.dependencies["@nestjs/mongoose"] = "^10.0.4";
  }

  if (pkg.dependencies["mongoose"]) {
    pkg.dependencies["mongoose"] = "^8.2.1";
  }

  if (pkg.dependencies["joi"]) {
    pkg.dependencies["joi"] = "^17.12.2";
  }

  if (pkg.dependencies["typescript"]) {
    pkg.dependencies["typescript"] = "^5.3.3";
  }

  if (pkg.dependencies["@nestjs/platform-express"]) {
    pkg.dependencies["@nestjs/platform-express"] = "^10.3.3";
  }

  if (pkg.dependencies["@nestjs/passport"]) {
    pkg.dependencies["@nestjs/passport"] = "^10.0.3";
  }

  if (pkg.dependencies["@nestjs/jwt"]) {
    pkg.dependencies["@nestjs/jwt"] = "^10.2.0";
  }

  if (pkg.dependencies["class-transformer"]) {
    pkg.dependencies["class-transformer"] = "^0.5.1";
  }

  if (pkg.dependencies["class-validator"]) {
    pkg.dependencies["class-validator"] = "^0.14.1";
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
