#!/bin/bash
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=grpc/proto/ grpc/proto/random.proto
