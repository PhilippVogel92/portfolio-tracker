//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct EmptyDonut: View {
  var body: some View {
    ZStack {
      Circle()
        .fill(AppColors.BACKGROUND)
        .frame(width: 315, height: 315)
      Circle()
        .fill(AppColors.LIGHT_PURPLE)
        .frame(width: 150, height: 150)
    }
  }
}

struct PortfolioLoadedView: View {
  @ObservedObject var portfolio: Portfolio
  var authenticationHandler: AuthenticationHandler

  var body: some View {
    ScrollView(showsIndicators: false) {
      VStack(alignment: .leading) {
        VStack {
          HStack {
            Text("Your balance")
              .roboto(size: 25, weight: .regular)
            Spacer()
          }
          HStack {
            Text(String(format: "%.2f€", portfolio.currentPortfolioValue))
              .roboto(size: 40, weight: .bold, foregroundColor: AppColors.PRIMARY)
            Spacer()
            NavigationLink(
              destination: AddStocksView(
                portfolio: portfolio, authenticationHandler: authenticationHandler
              ).navigationTitle(
                "Add Stocks")

            ) {
              Label("add", systemImage: "plus.circle")
                .font(.system(size: 50)).fontWeight(.ultraLight)
                .foregroundColor(AppColors.PRIMARY)
                .labelStyle(.iconOnly)
            }
          }
        }.padding()
        ZStack {
          Rectangle()
            .fill(.white)
            .opacity(0.15)
            .frame(maxWidth: .infinity)
            .cornerRadius(radius: 40.0, corners: [.topLeft, .topRight, .bottomLeft, .bottomRight])
            .ignoresSafeArea()
          VStack {
            if portfolio.isEmpty() {
              EmptyDonut().padding(.bottom, 30)
              Text("Tap the plus button to add a new stock.").roboto(
                size: 25, foregroundColor: Color.white
              ).multilineTextAlignment(.center)
            } else {
              PieChart(
                portfolio: portfolio,
                separatorColor: Color(UIColor.systemBackground),
                innerColor: AppColors.LIGHT_PURPLE,
                accentColors: pieColors,
                portfolioHandler: PortfolioHandler(authenticationHandler: authenticationHandler)
              ).padding()
            }
            Button {
              authenticationHandler.logout()
            } label: {
              Text("Logout")
                .roboto(size: 20, weight: .medium)
                .frame(width: 300, height: 50)
            }.background(AppColors.PRIMARY)
              .cornerRadius(8)
              .padding()
          }.padding()
        }
      }
    }
    .navigationTitle("Portfolio")
    .preferredColorScheme(.dark)
  }

}

struct PortfolioView: View {
  var portfolioHandler: PortfolioHandler
  var authenticationHandler: AuthenticationHandler

  var body: some View {
    NavigationView {
      ZStack {
        AppColors.BACKGROUND.ignoresSafeArea()
        AsyncContentView(
          loadable: PortfolioLoader(portfolioHandler: portfolioHandler),
          loadingView: StyledProgressSpinner(text: "Loading Portfolio..")
        ) { portfolio in
          PortfolioLoadedView(portfolio: portfolio, authenticationHandler: authenticationHandler)
        }

      }
    }
  }
}
